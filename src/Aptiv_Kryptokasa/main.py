#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime, date
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
    unique_symbols = list({item['selectedOption'] for item in all_data})

    # url_sources = 3 * [f"https://api.zondacrypto.exchange/rest/trading/ticker/"]
    url_sources = [f"https://api.zondacrypto.exchange/rest/trading/ticker/", "", ""]
    prices = [fetch_crypto_price(symbol=symbol, source_url=url) for url in url_sources for symbol in unique_symbols]

    # calculate average

    # PDF report part
    pdf_buffer = create_pdf(12, "4324342", 20)
    response = Response(pdf_buffer.read(), content_type='application/pdf')
    response.headers['Content-Disposition'] = 'inline; filename=sample.pdf'

    return jsonify({'price': prices})


def fetch_crypto_price(symbol, source_url, currency="PLN"):
    url = f"{source_url}{symbol}-{currency}"
    try:
        data = fetch_url(url)
    except Exception as e:
        print("data could not be fetched")
        return {'price': "", 'date': "", 'url': url, 'stock': "", 'symbol': symbol, 'currency': currency}


    if data["status"] == "Fail" and "TICKER_NOT_FOUND" in data["errors"]:
        currency = "USD"
        url = f"{source_url}{symbol}-{currency}"
        data = fetch_url(url)
    if currency == "USD":
        usd_to_pln_price = fetch_usd_to_pln_price()
    timestamp = int(data["ticker"]["time"])
    date = datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d %H:%M:%S')
    price = data["ticker"]["rate"]
    stock = stocks_enum[source_url]
    return {'price': price, 'date': date, 'url': url, 'stock': stock, 'symbol': symbol, 'currency': currency}


def fetch_url(url):
    response = requests.get(url)
    return response.json()


def fetch_usd_to_pln_price():
    fetched_json = fetch_url(NBP_URL)
    usd_to_pln_price = fetched_json["rates"][0]["mid"]
    return usd_to_pln_price


def create_pdf(raportId, numerSprawy, sredniaWartosc):
    buffer = BytesIO()
    # Create a PDF document
    c = canvas.Canvas(buffer, pagesize=A4)

    # Handling polish letters
    font_name = "Verdana"
    pdfmetrics.registerFont(TTFont(font_name, 'Verdana.ttf'))
    standard_text_size = 12

    # print first line data
    c.setFont(font_name, standard_text_size)
    line_level = 800
    # data
    data_txt = date.today().strftime("%d.%m.%Y r.")
    c.drawString(20, line_level, data_txt)
    # raportId
    raportId_text = "Numer raportu: " + str(raportId)
    raportId_width = c.stringWidth(raportId_text, font_name, standard_text_size)
    x_right_aligned = A4[0] - raportId_width - 20
    c.drawString(x_right_aligned, line_level, raportId_text)

    # title
    title_text = "Szacowanie wartości kryptoaktywów"
    title_font_size = 24
    title_width = c.stringWidth(title_text, font_name, title_font_size)
    x_centered = (A4[0] - title_width) / 2
    c.setFont(font_name, title_font_size)
    c.drawString(x_centered, 730, title_text)

    c.setFont(font_name, standard_text_size)

    # numer sprawy
    numerSprawy_text = "Numer sprawy: " + str(numerSprawy)
    c.drawString(80, 650 , numerSprawy_text)

    # rednia wartosc s
    sredniaWartosc_text = "Średnia wartość: " + str(sredniaWartosc)
    c.drawString(80, 630 , sredniaWartosc_text)

    c.save()
    buffer.seek(0)

    return buffer


if __name__ == '__main__':
    app.run(debug=False)
