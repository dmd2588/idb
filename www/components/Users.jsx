import React from 'react' //eslint-disable-line
import moment from 'moment'
import RfGrid from './RfGrid.jsx'
import { getUsers } from '../api.js'

export default class Users extends React.Component {
  loadDataFromServer (options, callback) {
    getUsers(options).then(function (res) {
      var users = res.data
      var myp = {
        title: 'Users',
        select_values: ['name', 'comment_karma', 'link_karma', 'created_utc'],
        cards: users.map(u => {
          return {
            title: u.name,
            subtitle: 'Joined: ' + moment(new Date(u.created * 1000)).format('LL'),
            link: '/users/detail/' + u.id
          }
        })
      }

      callback(myp)
    })
  }

  render () {
    return <RfGrid filterOptions={[{name: 'is_gold', value: false}]} loadDataFromServer={(ops, callback) => this.loadDataFromServer(ops, callback)} />
  }
}
