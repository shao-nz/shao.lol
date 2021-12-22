/* eslint-disable */

import React, { Component } from 'react';
import { SummonerProfile } from './SummonerProfile'
import { MatchData } from './MatchData'
import "./styles/Tracker.css";
import logo from "./static/cursed_flushed.png";

export class Tracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      summonerByNameData: {},
      matchDataVisible: false
    };
  }

  handleCallback = (summonerData, matchData) => {
    this.setState({
      summonerByNameData: summonerData,
      matchDataVisible: matchData
    })
  }

  render() {
    return (
        <>
        <img src={logo} alt='cursed flushed emoji'></img>
        <div className='big-box'>
          {/* <div className='searchBar'>
              <button/>
              <form onSubmit={this.onFormSubmit}>
                  <input type='text' onChange={e => this.setState({searchText: e.target.value.toLowerCase().replace(/ /g, '')})}></input>
                  <button type='submit' /> <br />
              </form>
          </div> */}
          <div className='summoners'>
            <SummonerProfile
              summonerName='Shao'
              passToParent = {this.handleCallback}
            />
            <SummonerProfile
              summonerName="Harbinsink"
              passToParent = {this.handleCallback}
            />
            <SummonerProfile
              summonerName="Barny Fargo"
              passToParent = {this.handleCallback}
            />
            <SummonerProfile
              summonerName="Jozendas"
              passToParent = {this.handleCallback}
            />
          </div>
          {
            this.state.matchDataVisible
            &&
            <div className='matchData'>
            <MatchData
                puuid={this.state.summonerByNameData.puuid}
                />
            </div>
          }
        </div>
        </>
  );
  }
}
