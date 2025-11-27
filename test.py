import requests

url = "http://127.0.0.1:3000/api/generate-Kolams?size=7&type=diamond"
res = requests.get(url)

data = res.json()
print(data)