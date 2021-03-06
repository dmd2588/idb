import React from 'react' //eslint-disable-line
import RfGrid from './RfGrid.jsx'
import { getSubreddits } from '../api.js'
import Paper from 'material-ui/Paper'

const style = {
  margin: 50,
  display: 'block'
}

export default class Subreddits extends React.Component {
  constructor (props) {
    super(props)
    this.state = {ops: {}}
  }
  retainOptions (ops) {
    this.setState({ops: ops})
    return this.state.ops
  }
  loadDataFromServer (options, callback) {
    getSubreddits(options).then(function (res) {
      var subreddits = res.data[0]
      var myp = {
        title: 'Subreddits',
        pages: res.data[1],
        select_values: ['default', 'title', 'accounts_active', 'subscribers', 'created_utc', 'display_name'],
        cards: subreddits.map(s => {
          // console.log('S', s.display_name, s)
          return {
            title: s.display_name,
            subtitle: 'Created: ' + s.created_utc,
            link: '/subreddits/detail/' + s.subreddit_id,
            preview: s.banner_img ? s.banner_img : '/dist/images/ic_local_movies_black_48dp_2x.png',
            icon: s.icon_img ? s.icon_img : '/dist/images/ic_account_circle_black_48dp_2x.png',
            customClass: s.banner_img ? '' : 'iconMedia'
          }
        })
      }
      callback(myp)
    })
  }
  render () {
    return (
      <div className='container'>
        <Paper style={style} zDepth={2}>
          <div className='container-no-width'>
            <RfGrid pages={this.state.pages} retainOptions={(o) => this.retainOptions(o)} filterOptions={[]} loadDataFromServer={(ops, callback) => this.loadDataFromServer(ops, callback)} />
          </div>
        </Paper>
      </div>
    )
  }
}
