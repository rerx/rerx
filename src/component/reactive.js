import { Component, createElement } from 'react';
import { Observable } from 'rxjs/Rx';
import { isBrowser } from '../utils/isBrowser';

function isObservableProp(propName) {
  return propName.charAt(propName.length - 1) === '$';
}

function isDOMtag(tag) {
  return tag.charCodeAt(0) >= 97;
}

export function reactive(tag) {
  class ReactiveComponent extends Component {
    constructor(props) {
      super(props);

      this.displayName = `ReactiveComponent:${tag}`;
      this.state = {};

      if (isBrowser) {
        this._observables = {};
      }

      Object.keys(props).forEach(propName => {
        const propValue = props[propName];

        if (isObservableProp(propName)) {
          if (isBrowser && propValue) {
            if (!(propValue instanceof Observable)) {
              console.error(`Prop \`${propName}\` is not observable.`);
              return;
            }

            const stateName = propName.substr(0, propName.length - 1);
            this._observables[stateName] = propValue;
          }
        } else if (isDOMtag(tag) && typeof propValue === 'function' && propValue.length > 1) {
          this.state[propName] = e => {
            propValue(e, this);
          };

          if (!this.event) {
            this.event = {};
          }

          // onClick -> click
          const eventType = propName.substr(2).toLowerCase();
          this.event[eventType] = e => e.target === this && e.type === eventType;
        } else {
          this.state[propName] = propValue;
        }
      });
    }

    componentWillMount() {
      const names = Object.keys(this._observables);

      if (!names.length) {
        return;
      }

      this._subscriptions = [];

      names.forEach(name => {
        const observable = this._observables[name];
        const subscription = observable.subscribe(nextState => {
          const curState = this.state[name];

          if (nextState !== curState) {
            this.setState({
              [name]: nextState
            });
          }
        });

        this._subscriptions.push(subscription);
      });
    }

    componentWillReceiveProps() {
      console.error(`Reactive Components should be updated via observable props.`);
    }

    componentWillUnmount() {
      if (this._subscriptions) {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
        this._subscriptions = null;
      }
    }

    render() {
      return createElement(tag, this.state);
    }
  }

  return ReactiveComponent;
}
