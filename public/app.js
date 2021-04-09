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
    try {
      const response = await fetch('/api/todo', {
        method: 'get',
      })
      const todos = await response.json()
      this.todos = todos;
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async addTodo() {
      const title = this.todoTitle.trim()
      if (!title) {
        return
      }
      try {
        const response = await fetch('/api/todo', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        })
        const { todo } = await response.json();

        this.todos.push(todo);
        this.todoTitle = ''
      } catch (err) {
        console.log(err);
      }
    },
    async removeTodo(id) {
      try {
        await fetch('/api/todo/' + id,  { method: 'DELETE' })
        this.todos = this.todos.filter(t => t.id !== id)
      } catch (err) {
        console.log(err)
      }
    },
    async completeTodo(id) {
      try {
        const response = await fetch('/api/todo/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: true })
        })
        const { todo } = await response.json()
        const current = this.todos.find(t => t.id === todo.id)

        current.updatedAt = todo.updatedAt;
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

      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
    }
  }
})
