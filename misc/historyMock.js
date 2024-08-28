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
