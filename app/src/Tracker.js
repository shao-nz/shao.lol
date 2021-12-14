import React, { Component } from 'react';
import { RiotAPI, RiotAPITypes, PlatformId } from '@fightmegg/riot-api'
import "./styles/Tracker.css"


export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: [] };
  }

  handleClick() {
  }
  async getSummoner() {
    const rAPI = new RiotAPI('');
    
    const summoner = await rAPI.summoner.getBySummonerName({
        region: PlatformId.OC1,
        summonerName: 'Shao',
      })
      this.setState({data: summoner})
    console.log(summoner.data)
    }
  render() {
      return (
    <div className='main'>
      tracker <br />
      <button onClick={this.getSummoner}>Press me</button>
    </div>
    
  );
  }
}