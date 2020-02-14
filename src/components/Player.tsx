import React from "react";
import {Link} from "react-router-dom";

import {settings, friendPlayer, isPlayerFriend} from "../lib";
import {Player} from "../models";
import {Icon} from ".";

class PlayerBase extends React.Component<{player: Player, showServer?: boolean}, {friend: boolean}>{
  constructor(props: any){
    super(props);

    this.state = {
      friend: false
    };
  }

  shouldComponentUpdate(nextProps: {player: Player, showServer: boolean}, nextState: {friend: boolean}): boolean{
    return nextState.friend !== this.state.friend || nextProps.player.timestamp !== this.props.player.timestamp;
  }
}

export class PlayerRow extends PlayerBase{
  render(): JSX.Element{
    const {player} = this.props;
    const serverTr = player.server && this.props.showServer && <td><Link to={`/s/${player.server.split(":")[0]}/${player.server.split(":")[1]}`}>{player.server}</Link></td>;

    return (
      <tr>
        <td><b>{player.callsign}</b> {player.motto && `(${player.motto})`}</td>
        <td>{player.team !== "Observer" && player.score}</td>
        <td>{player.team}</td>
        {serverTr}
        <td><button className="btn icon" onClick={() => {
          friendPlayer(player.callsign);
          this.setState({friend: settings.getJson("friends", []).includes(player.callsign)});
        }} title={isPlayerFriend(player.callsign) ? "Remove friend" : "Add as friend"}>{Icon("friend", isPlayerFriend(player.callsign), "url(#e)")}</button></td>
      </tr>
    );
  }
}

export class PlayerCard extends PlayerBase{
  render(): JSX.Element{
    return (
      <div>
        <h2>
          <button className="btn icon" onClick={(e) => {
            e.stopPropagation();
            friendPlayer(this.props.player.callsign);
            this.setState({friend: isPlayerFriend(this.props.player.callsign)});
          }}>{Icon("friend", settings.getJson("friends", []).includes(this.props.player.callsign), "url(#e)")}</button>
          {this.props.player.callsign}
        </h2><br/>
        <table className={settings.getBool(settings.COMPACT_TABLES) ? "table-compact" : ""}>
          <tbody>
            {this.props.player.team !== "Observer" &&
              <tr>
                <td>Score</td>
                <td>{this.props.player.score}</td>
              </tr>
            }
            <tr>
              <td>Team</td>
              <td>{this.props.player.team}</td>
            </tr>
            <tr>
              <td>Server</td>
              <td><Link to={`/s/${this.props.player.server.split(":")[0]}/${this.props.player.server.split(":")[1]}`}>{this.props.player.server}</Link></td>
            </tr>
            {this.props.player.motto &&
              <tr>
                <td>Motto</td>
                <td>{this.props.player.motto}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    );
  }
}
