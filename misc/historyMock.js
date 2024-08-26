const expenses = [{
  "id": "33eb5816-ffc3-48b3-b385-cc3e11c75f63",
  "category": "travel",
  "amount": 44,
  "currency": "EUR",
  "date": 1724514103495
}, {
  "id": "9866dd6d-532c-4078-af8a-015a2bd80c2d",
  "category": "pharmacy",
  "amount": 55,
  "currency": "EUR",
  "date": 1724341558953
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "entertainments",
  "amount": 22,
  "currency": "EUR",
  "date": 1724255178985
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "meal",
  "amount": 22,
  "currency": "EUR",
  "date": 1724082391741
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "sport",
  "amount": 32,
  "currency": "EUR",
  "date": 1724514098605
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "entertainments",
  "amount": 22,
  "currency": "EUR",
  "date": 1723996004773
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "home",
  "amount": 11,
  "currency": "EUR",
  "date": 1724514098605
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "bus",
  "amount": 65,
  "currency": "EUR",
  "date": 1724514098605
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "travel",
  "amount": 98,
  "currency": "EUR",
  "date": 1724514098605
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "travel",
  "amount": 31,
  "currency": "EUR",
  "date": 1724514098605
}, {
  "id": "4eb19760-2e0a-4505-af0b-42d58c2fd1fd",
  "category": "nicotine",
  "amount": 25,
  "currency": "EUR",
  "date": 1724514098605
}]

const randomHistory = []

const categoriesIds = ['meal', 'clothes', 'entertainments', 'sport', 'utility-bills', 'home', 'rental-payment', 'bus', 'pharmacy', 'travel', 'barbershop', 'alcohol', 'nicotine', 'subscriptions', 'another']

for (let i = 0; i < 60; i++) {
  randomHistory.push({
    id: Math.random().toString(36).substr(2, 9),
    category: categoriesIds[Math.floor(Math.random() * categoriesIds.length)],
    amount: Math.floor(Math.random() * 100),
    currency: 'EUR',
    date: Date.now() - Math.floor(Math.random() * 1000000000)
  })
}

console.log(JSON.stringify(randomHistory))
