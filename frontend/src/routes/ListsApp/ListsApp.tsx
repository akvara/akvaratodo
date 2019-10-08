import React from 'react';
// import ListsTable from '../../components/ListsPage';
import { disableHotKeys, registerHotKeys } from '../../utils/hotkeys';
import ListsTable from '../../components/ListsTable';

const ListsApp:React.FC = ({}) => {
  return (<div>
    <table >
      <tbody>
      <tr>
        <td>
          <h1>Lists</h1>
        </td>
        <td className="right-align">
          {/*{this.props.legacyExists && (*/}
            {/*<span>*/}
                    {/*<button onClick={this.props.collectPastDaysRequest}> >> T</button>{' '}*/}
                  {/*</span>*/}
          {/*)}*/}
          <button onClick={this.goToday}>
            <u>T</u>oday
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <ListsTable
      // lists={this.state.lists}
      // openList={this.openAList}
      // toggleContracted={this.toggleContracted}
      // removeList={this.removeList}
      // hotKeys={this.hotKeys}
    />
    <h3>Protected</h3>
    <ListsTable
      // lists={this.state.immutableLists}
      // openList={this.openAList}
    />
    <form onSubmit={this.handleSubmit}>
      <input
        className="list-input"
        // ref={(input) => {
        //   this.listNameInput = input;
        // value={this.state.listName}
        // onFocus={disableHotKeys.bind(this)}
        // onBlur={registerHotKeys.bind(this, this.checkKeyPressed)}
        // onKeyDown={this.handleKeyDownAtListInput}
        // onChange={this.onNameChange}
      />
      <button disabled={!this.state.listName.trim()}>Create new list</button>
    </form>
    <hr />
    <button onClick={this.props.planWeek}>
      <u>P</u>lan week
    </button>
    <button onClick={this.reload}>
      <span className={'glyphicon glyphicon-refresh'} aria-hidden="true" /> <u>R</u>eload
    </button>
  </div>);
};

export default ListsApp;
