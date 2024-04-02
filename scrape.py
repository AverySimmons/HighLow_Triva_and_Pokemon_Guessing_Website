import requests

url = "http://numberapi.com/"
bad = [
    "is a boring number.",
    "is an unremarkable number.",
    "is an uninteresting number.",
    "is a number for which we're missing a fact (submit one to numbersapi at google mail!)."
]

good_nums = []

for i in range(10000):
    print(i)
    new_url = url + str(i)
    text = requests.get(new_url).text
    text = text.split(' ', 1)[1]
    if text not in bad:
        good_nums.append(i)

with open("data.txt", 'w') as file:
    for i in good_nums:
        file.write(str(i) + "\n")

print("done writing")