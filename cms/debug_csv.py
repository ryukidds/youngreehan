import csv

products_csv_path = "/Users/ryukidds/Desktop/영리한 웹사이트/cms/[영리한]_상품_리스트_Products.csv"
with open(products_csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    print("Fieldnames:", reader.fieldnames)
    for idx, row in enumerate(reader):
        print(f"Row {idx}: {row}")
