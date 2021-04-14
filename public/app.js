const graphqlRequest = async ({ headers, body }) => {
  return fetch('/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body)
  });
};

new Vue({
  el: '#app',
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: '',
      todos: []
    }
  },
  async created() {
    const query = `
      query {
        getTodos {
          id title done createdAt updatedAt
        }
      }
    `;

    const response = await graphqlRequest({ body: { query } });
    const json = await response.json();
    this.todos = json.data.getTodos;
  },
  methods: {
    async addTodo() {
      const title = this.todoTitle.trim()
      if (!title) {
        return
      }
      try {
        const query = `
          mutation {
            createTodo(todo: { title: "${title}" }) {
              id title done createdAt updatedAt
            }
          }
        `;

        const response = await graphqlRequest({ body: { query } });
        const json = await response.json();
        const todo = json.data.createTodo;

        this.todos.push(todo);
        this.todoTitle = ''
      } catch (err) {
        console.log(err);
      }
    },
    async removeTodo(id) {
      try {
        const query = `
          mutation {
            deleteTodo(id: "${id}")   
          }
        `;

        const response = await graphqlRequest({ body: { query }})
        const json = await response.json();
        const isDeleted = json.data.deleteTodo;
        if (isDeleted) {
          this.todos = this.todos.filter(t => t.id !== id)
        } else {
          throw new Error("Something went wrong when removing todo with ID: " + id);
        }
      } catch (err) {
        console.log(err)
      }
    },
    async completeTodo(id) {
      try {

        const query = `
          mutation {
            completeTodo(id: "${id}") {
              updatedAt      
            }
          }
        `;

        const response = await graphqlRequest({ body: { query }});
        const json = await response.json()
        const { updatedAt } = json.data.completeTodo;
        const current = this.todos.find(t => t.id === id)

        current.updatedAt = updatedAt;
        // ???? why we don't do it? current.done = todo.done ??
        // ??? Looks like checkbox is uncontrolled
        console.log({ todo, current, todos: this.todos}) // FIXME: TODO: REMOVE
      } catch (err) {
        console.log(err)
      }
    }
  },
  filters: {
    capitalize(value) {
      return value.toString().charAt(0).toUpperCase() + value.slice(1)
    },
    date(value, withTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      }

      if (withTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
      }

      // GraphQL returns String (my implementation)
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
    }
  }
})
