
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://jajupiter:bcvJApcNNnp2Fj8P@jajupiter.8kkkila.mongodb.net/?retryWrites=true&w=majority&appName=jajupiter";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: false
});



async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
      console.log(e)
    }
  }
await run()

const db = client.db('libreriaJUI')

export default db



//68c1d95e1c79976dc83935db id del usuario