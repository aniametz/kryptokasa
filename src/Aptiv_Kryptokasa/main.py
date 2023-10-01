#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify, Response, abort
from flask_cors import CORS
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime, date
import os
import time
import requests
from io import BytesIO

from utils.enums import *

app = Flask(__name__)
CORS(app)

NBP_URL = f"https://api.nbp.pl/api/exchangerates/rates/a/usd/?format=json"


# automatic fetch from 3 sources
@app.route('/get_price', methods=['POST'])
def get_price():
    all_data = request.json
    url_sources = 3 * [f"https://api.zondacrypto.exchange/rest/trading/ticker/"]
    prices = [fetch_crypto_price(symbol=data['selectedOption'], quantity=data['numericValue'], source_url=url) for url in url_sources for data in all_data]
    return jsonify(prices)

@app.route('/generate_report', methods=['POST'])
def generate_report():
    all_data = request.json
    aggregated_data = {}

    for entry in all_data:
        symbol = entry["symbol"]
        price = float(entry["price"])  # Convert price to float for calculation
        quantity = float(entry["quantity"])  # Convert price to float for calculation

        if symbol not in aggregated_data:
            aggregated_data[symbol] = {"sum": 0, "count": 0, "quantity": 0}

        aggregated_data[symbol]["sum"] += price
        aggregated_data[symbol]["count"] += 1
        aggregated_data[symbol]["quantity"] += quantity
        aggregated_data[symbol]["average"] = aggregated_data[symbol]["sum"] / aggregated_data[symbol]["count"]

    averages = {symbol: values["sum"] / values["count"] for symbol, values in aggregated_data.items()}
    # PDF report part
    report_id = int(time.time())
    case_id= str(time.time())
    create_pdf(report_id, case_id, aggregated_data)
    return jsonify(aggregated_data)


def fetch_crypto_price(symbol, quantity, source_url, currency="PLN"):
    url = f"{source_url}{symbol}-{currency}"
    try:
        data = fetch_url(url)
    except Exception as e:
        print("data could not be fetched")
        return {'price': "", 'quantity': "",'date': "", 'url': url, 'stock': "", 'symbol': symbol, 'currency': currency}


    if data["status"] == "Fail" and "TICKER_NOT_FOUND" in data["errors"]:
        currency = "USD"
        url = f"{source_url}{symbol}-{currency}"
        data = fetch_url(url)
    timestamp = int(data["ticker"]["time"])
    fetch_date = datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d %H:%M:%S')
    price = data["ticker"]["rate"] if currency=="PLN" else fetch_usd_to_pln_price() * data["ticker"]["rate"]
    stock = stocks_enum[source_url]
    return {'price': price, 'quantity': quantity, 'date': fetch_date, 'url': url, 'stock': stock, 'symbol': symbol, 'currency': currency}


def fetch_url(url):
    response = requests.get(url)
    return response.json()


def fetch_usd_to_pln_price():
    fetched_json = fetch_url(NBP_URL)
    usd_to_pln_price = fetched_json["rates"][0]["mid"]
    return usd_to_pln_price


def create_pdf(report_id, case_id, aggregated_data):
    path_to_save = os.path.join(get_downloads_folder(), f'report_{report_id}.pdf')
    c = canvas.Canvas(path_to_save, pagesize=A4)

    # Handling polish letters
    font_name = "Verdana"
    pdfmetrics.registerFont(TTFont(font_name, 'Verdana.ttf'))
    standard_text_size = 12

    # First page with case_id and report_id and document title
    generate_first_page(c, report_id, case_id, font_name, standard_text_size)

    # Generate page for each cryptocurrency
    for crypto, data in aggregated_data.items():
        generate_crypto_page(c, crypto, data, font_name, standard_text_size)

    c.save()


def generate_first_page(c, report_id, case_id, font_name, text_size):
    # First line data
    line_level = 800
    data_txt = date.today().strftime("%d.%m.%Y r.")
    c.drawString(20, line_level, data_txt)
    raportId_text = "Numer raportu: " + str(report_id)
    raportId_width = c.stringWidth(raportId_text, font_name, text_size)
    x_right_aligned = A4[0] - raportId_width - 20
    c.drawString(x_right_aligned, line_level, raportId_text)

    # Title
    title_text = "Szacowanie wartości kryptoaktywów"
    title_font_size = 24
    title_width = c.stringWidth(title_text, font_name, title_font_size)
    x_centered = (A4[0] - title_width) / 2
    c.setFont(font_name, title_font_size)
    c.drawString(x_centered, 730, title_text)

    c.setFont(font_name, text_size)
    numerSprawy_text = "Numer sprawy: " + str(case_id)
    c.drawString(80, 650, numerSprawy_text)

    c.showPage()


def generate_crypto_page(c, crypto, data, font_name, text_size):
    c.setFont(font_name, text_size)

    # Crypto Title
    crypto_title = f"Aktywo: {crypto}"
    c.drawString(80, 750, crypto_title)

    # Display data
    quantity_text = f"Ilość: {data['quantity']}"
    average_text = f"Średnia cena: {data['average']}"
    count_text = f"Średnia liczona z {data['count']} źródeł"
    sum_text = f"Wartość aktywów w oparciu o średnią cenę: {round(data['quantity']*data['average'], 2)} PLN"

    c.drawString(80, 720, quantity_text)
    c.drawString(80, 700, average_text)
    c.drawString(80, 680, count_text)
    c.drawString(80, 660, sum_text)

    c.showPage()

# manual mode
def validate_required_fields(json_data):
    required_elements = 3
    if len(json_data) == required_elements:
        for el in json_data:
            if not("adres" in el and "nazwa" in el and "kurs" in el and "symbol" in el):
                return False
    else:
        return False

    return True

@app.route('/get_manual_price', methods=['POST'])
def get_manual_price():
    received_json = request.get_json()

    if not validate_required_fields(received_json):
        abort(404, description="Invalid given json")

    # to do handling exchange rates

    return "Success"

def get_downloads_folder():
    home = os.path.expanduser("~")
    return os.path.join(home, 'Downloads')

if __name__ == '__main__':
    app.run(debug=False)
