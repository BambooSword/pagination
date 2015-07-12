'use strict';

let React = require('react');
let Pager = require('./Pager');
let Options = require('./Options');


function noop() {}

class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: props.current,
      pageSize: props.pageSize
    };

    ['render', '_handleChange', '_changePageSize', '_isValid', '_prev', '_next', '_hasPrev', '_hasNext', '_jumpPrev', '_jumpNext', '_canJumpPrev', '_canJumpNext'].map((method) => this[method] = this[method].bind(this));
  }


  render() {
    let prefixCls = 'rc-pagination';

    let props = this.props;

    if (props.className) {
      prefixCls = `${prefixCls} ${props.className}`;
    }

    let allPages = this._calcPage();
    let pagerList = [];
    let jumpPrev = null;
    let jumpNext = null;

    if (allPages <= 9) {
      for (let i = 1; i <= allPages; i++) {
        let active = this.state.current === i;
        pagerList.push(<Pager onClick={this._handleChange.bind(this, i)} key={i} page={i} active={active} />);
      }
    } else {
      jumpPrev = <li key="prev" onClick={this._jumpPrev} className="jump-prev"><a></a></li>;
      jumpNext = <li key="next" onClick={this._jumpNext} className="jump-next"><a></a></li>;

      let current = this.state.current;

      if (current <= 5) {
        // do not show first •••
        for (let i = 1; i <= 5; i++) {
          let active = current === i;
          pagerList.push(<Pager onClick={this._handleChange.bind(this, i)} key={i} page={i} active={active} />);
        }
        pagerList.push(jumpNext);
        pagerList.push(<Pager onClick={this._handleChange.bind(this, allPages)} key={allPages} page={allPages} active={false} />);
      } else if (allPages - current < 5) {
        // do not show last •••
        pagerList.push(<Pager onClick={this._handleChange.bind(this, 1)} key={1} page={1} active={false} />);
        pagerList.push(jumpPrev);
        for (let i = allPages - 4; i <= allPages; i++) {
          let active = current === i;
          pagerList.push(<Pager onClick={this._handleChange.bind(this, i)} key={i} page={i} active={active} />);
        }
      } else {
        // show both •••
        pagerList.push(<Pager onClick={this._handleChange.bind(this, 1)} key={1} page={1} active={false} />);
        pagerList.push(jumpPrev);
        for (let i = current - 2; i <= current + 2; i++) {
          let active = current === i;
          pagerList.push(<Pager onClick={this._handleChange.bind(this, i)} key={i} page={i} active={active} />);
        }
        pagerList.push(jumpNext);
        pagerList.push(<Pager onClick={this._handleChange.bind(this, allPages)} key={allPages} page={allPages} active={false} />);
      }

    }

    return (
      <ul className={prefixCls}>
        <li onClick={this._prev} className={(this._hasPrev() ? '' : 'disabled ') + 'prev'}><a>&lt;</a></li>
        {pagerList}
        <li onClick={this._next} className={(this._hasNext() ? '' : 'disabled ') + 'next'}><a>&gt;</a></li>
        <Options changeSize={this.props.showSizeChanger ? this._changePageSize.bind(this) : null} current={this.state.current} quickGo={this.props.showQuickJumper ? this._handleChange.bind(this) : null} />
      </ul>
    );
  }

  // private methods

  _calcPage() {
    return Math.floor((this.props.total - 1) / this.state.pageSize);
  }

  _isValid(page) {
    return typeof page === 'number';// && page >= 1 && page <= this._calcPage();
  }

  _changePageSize(size) {
    if (typeof size === 'number') {
      this.setState({
        pageSize: size
      });
    }
  }

  _handleChange(page) {
    if (this._isValid(page)) {
      this.setState({current: page});
      this.props.onChange(page);
    }
  }

  _prev() {
    if (this._hasPrev()) {
      this._handleChange(this.state.current - 1);
    }
  }

  _next() {
    if (this._hasNext()) {
      this._handleChange(this.state.current + 1);
    }
  }

  _jumpPrev() {
    if (this._canJumpPrev()) {
      this._handleChange(this.state.current - 5);
    }
  }

  _jumpNext() {
    if (this._canJumpNext()) {
      this._handleChange(this.state.current + 5);
    }
  }

  _hasPrev() {
    return this.state.current > 1;
  }

  _hasNext() {
    return this.state.current < this._calcPage();
  }

  _canJumpPrev() {
    return this.state.current > 5;
  }

  _canJumpNext() {
    return this._calcPage() - this.state.current > 5;
  }

}

Pagination.propTypes = {
  current: React.PropTypes.number,
  total: React.PropTypes.number,
  pageSize: React.PropTypes.number,
  onChange: React.PropTypes.func,

  showSizeChanger: React.PropTypes.bool,
  showQuickJumper: React.PropTypes.bool
};

Pagination.defaultProps = {
  current: 1,
  total: 0,
  pageSize: 10,
  onChange: noop,

  showQuickJumper: false,
  showSizeChanger: false
};

module.exports = Pagination;
