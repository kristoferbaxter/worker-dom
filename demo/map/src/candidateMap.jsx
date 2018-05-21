import { h, Component } from 'preact';
import objstr from 'obj-str';

import styles from './candidateMap.css';

class CandidateZone extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fill: 'red',
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    this.setState({
      fill: 'black',
    });
    this.props.focusRegion(this.props.index);
  }

  handleMouseLeave() {
    this.setState({
      fill: 'red',
    });
    this.props.focusRegion(null);
  }

  render(props, state) {
    return <rect x={props.x} y={props.y} width="180" height="180" fill={state.fill} stroke="black" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />;
  }
}

export class CandidateMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
      focusedRegion: null,
    };

    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.focusRegion = this.focusRegion.bind(this);
  }

  handleMouseLeave() {
    this.focusRegion(null);
  }

  focusRegion(region) {
    this.setState({
      showTooltip: region !== null,
      focusedRegion: region !== null ? region : null,
    });

    this.props.focusRegion(region);
  }

  render(props, state) {
    const focusedRegionData = state.focusedRegion !== null && props.regionData[state.focusedRegion].candidates;
    const winner = focusedRegionData && props.totalData[focusedRegionData.indexOf(Math.max(...focusedRegionData))];
    return (
      <div class={styles.wrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" onMouseLeave={this.handleMouseLeave}>
          <CandidateZone x={0} y={0} index={0} focusRegion={this.focusRegion} />
          <CandidateZone x={180} y={0} index={1} focusRegion={this.focusRegion} />
          <CandidateZone x={0} y={180} index={2} focusRegion={this.focusRegion} />
          <CandidateZone x={180} y={180} index={3} focusRegion={this.focusRegion} />
        </svg>
        <p
          class={objstr({
            [styles.tooltip]: true,
            [styles.showTooltip]: state.showTooltip,
          })}
        >
          Region winner {!!winner && winner.name}
        </p>
      </div>
    );
  }
}
