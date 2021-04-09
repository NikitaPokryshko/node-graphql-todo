const { Router } = require('express');
const Todo = require('../models/todo');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server error',
    })
  }
})

router.post('/', async (req, res) => {
  try {
    // create() === build().save()
    const todo = await Todo.create({
      title: req.body.title,
      done: false,
    });

    res.status(201).json({ todo }) // 201 - created
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server error',
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(Number(req.params.id));
    todo.done = req.body.done;
    await todo.save()
    res.status(200).json({ todo })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server error',
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const todos = await Todo.findAll({ //findByPk can be used without 'where', but just for example)
      where: {
        id: Number(req.params.id),
      }
    });
    const todo = todos[0];
    await todo.destroy()
    res.status(204).json({}) // 204 - deleted, but no content result
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Server error',
    })
  }
})

module.exports = router
