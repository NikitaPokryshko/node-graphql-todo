const users = [
  {
    name: "Pablo Escobar",
    age: 50,
    email: "pablo.escobar@cartels.org"
  },
  {
    name: "Miguel Angel",
    age: 40,
    email: "miguel.angel@cartels.org"
  }
]

module.exports = {
  test() {
    return {
      count: users.length,
      users,
    }
  },
  random({ min, max, count }) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const random = Math.random() * (max - min) + min;
      arr.push(random)
    }
    return arr
  },
  addTestUser({ user: { name, email }}) {
    const user = {
      name,
      email,
      age: Math.ceil(Math.random() * 30)
    }
    users.push(user)

    return user;
  }
}
