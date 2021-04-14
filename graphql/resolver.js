const Todo = require('../models/todo')

module.exports = {
  // Resolvers for DB data
  async getTodos() {
    try {
      return await Todo.findAll();
    } catch (err) {
      throw new Error('Fetch todos is not available')
    }
  },

  async createTodo({ todo }) {
    try {
      return await Todo.create({
        title: todo.title,
        done: false,
      });
    } catch (err) {
      throw new Error('Title is required')
    }
  },

  async completeTodo({ id }) {
    try {
      if (!id) throw new Error('ID is required')

      const todo = await Todo.findByPk(id)
      todo.done = true
      await todo.save()

      return todo
    } catch (err) {
      console.error(err)
    }
  },

  async deleteTodo({ id }) {
    try {
      if (!id) throw new Error('ID is required')
      const todo = await Todo.findByPk(id)
      todo.destroy()

      return true;
    } catch (err) {
      console.error(id)
      return false; // boolean must be returned according to schema
    }
  }

}
