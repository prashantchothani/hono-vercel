import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => { 
    
    const GLOBAL_REQUEST_CITY = c.get('GLOBAL_REQUEST_CITY')
    return c.json('list profile ' + GLOBAL_REQUEST_CITY)

})
app.post('/', (c) => c.json('create an profile', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app