/* eslint-disable */

import React, { Component, useState } from 'react';
import "./styles/Tracker.css";

const RGAPI_KEY = 'RGAPI-4c10bc02-c175-4056-b1a6-f10f8337607f'

const QUEUE_TYPES = {
  "RANKED_FLEX_SR": "Ranked Flex",
  "RANKED_SOLO_5x5": "Ranked Solo"
}

const TIERS = {
  "IRON": "Iron",
  "BRONZE": "Bronze",
  "SILVER": "Silver",
  "GOLD": "Gold",
  "PLATINUM": "Platinum",
  "DIAMOND": "Diamond",
  "MASTER": "Master",
  "GRANDMASTER": "Grandmaster",
  "CHALLENGER": "Challenger"
}

const LobbyType = ({queueType, tier, rank, leaguePoints, wins, losses}) => (
  <div>
    <p>
      {queueType} <br />
      {tier} {rank} {leaguePoints }LP<br />
      Wins: {wins} Losses: {losses} <br /> 
    </p>
  </div>
);

export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchText: '',
      summonerByNameData: [],
      leagueEntriesBySummonerData: []
    }
  }

  async getDataFromSummonerName(e) {
    var request = 'https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + this.state.searchText + '?api_key=' + RGAPI_KEY;
    let response = await fetch(request);
    let data = await response.json();
    this.setState({
      summonerByNameData: data
    })

    request = 'https://oc1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + this.state.summonerByNameData.id + '?api_key=' + RGAPI_KEY;
    response = await fetch(request);
    data = await response.json();
    this.setState({
      leagueEntriesBySummonerData: data
    });
  }

  render() {
      return (
    <div className='main'>
      <input type='text' onChange={e => this.setState({searchText: e.target.value})}></input>
      <button onClick={e => this.getDataFromSummonerName(e)}>Press me</button> <br />
      {this.state.summonerByNameData != ''
      ?
        <div>
          Tracking <b>{this.state.summonerByNameData.name} </b> <br />
          Summoner level: {this.state.summonerByNameData.summonerLevel} <br />
          <img width="100px" height="100px" src={'https://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/' + this.state.summonerByNameData.profileIconId + '.png'}></img> <br />

          {this.state.leagueEntriesBySummonerData.map((queue) => (
              <LobbyType
                queueType={QUEUE_TYPES[queue.queueType]}
                tier={TIERS[queue.tier]}
                rank={queue.rank}
                leaguePoints={queue.leaguePoints}
                wins={queue.wins}
                losses={queue.losses}
                key={queue.leagueId}
              />
            ))}
        </div>
      :
        <p>
          Player not found!
        </p>
        
      }
    </div>
    
  );
  }
}