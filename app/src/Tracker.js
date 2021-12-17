/* eslint-disable */

import React, { Component, useState } from 'react';
import "./styles/Tracker.css";

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

const SummonerProfile = ({summonerName, profileIconId, summonerLevel, summonerData}) => {
  return (
    <div className='summonerProfile'>
      <p>
        Tracking <b>{summonerName} </b> <br />
        <img width="100px" height="100px" src={'https://ddragon.leagueoflegends.com/cdn/11.24.1/img/profileicon/' + profileIconId + '.png'}></img> <br />
        {summonerLevel} <br />
        {summonerData.map((queue) => (
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
      </p>
    </div>
  );
}

export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchText: '',
      summonerFound: false,
      summonerByNameData: [],
      leagueEntriesBySummonerData: []
    }
  }

  async getDataFromSummonerName(e) {
    var request = 'https://shao.lol/api/riot/summoner/' + this.state.searchText
    let response = await fetch(request);
    if (!response.ok) {
      const message = "Error: {response.status}";
      throw new Error(message);
    }
    let data = await response.json();
    this.setState({
      summonerByNameData: data,
      summonerFound: true
    })

    request = 'https://shao.lol/api/riot/lol-by-summoner/' + this.state.summonerByNameData.id
    response = await fetch(request);
    if (!response.ok) {
      const message = "Error: {response.status}";
      throw new Error(message);
    }
    data = await response.json();
    this.setState({
      leagueEntriesBySummonerData: data,
      summonerFound: true
    });
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    this.getDataFromSummonerName(e);
  }

  render() {
    return (
      <div>
        <div className='searchBar'>
            <form onSubmit={this.onFormSubmit}>
                <input type='text' onChange={e => this.setState({searchText: e.target.value})}></input>
                <button type='submit' /> <br />
            </form>
        </div>
        {this.state.summonerFound == true
        ?
        <SummonerProfile 
          summonerName={this.state.summonerByNameData.name}
          profileIconId={this.state.summonerByNameData.profileIconId}
          summonerLevel={this.state.summonerByNameData.summonerLevel} 
          summonerData={this.state.leagueEntriesBySummonerData}
        />
        :
          <p>
          </p>
          
        }
      </div>
  );
  }
}
