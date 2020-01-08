// https://apollo.vuejs.org/zh-cn/guide/apollo/queries.html
// https://www.apollographql.com/docs/apollo-server/
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import Vue from 'vue'

Vue.use(VueApollo)

const ngecc = new HttpLink({
  uri: 'http://10.1.8.177:8074/v1/graphql',
  headers: {
    'x-hasura-admin-secret': 'zhongjiao'
  }
})

const apolloClient = new ApolloClient({
  link: ngecc,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export default apolloProvider
