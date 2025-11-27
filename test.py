import requests

url = "http://127.0.0.1:8000/generate?type=diamond&size=3&count=1"

res = requests.get(url).json()
print(res)