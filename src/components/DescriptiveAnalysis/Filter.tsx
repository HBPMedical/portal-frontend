import $ from 'jquery';
import QueryBuilder from 'jQuery-QueryBuilder';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import './jquery-builder.css';
import styled from 'styled-components';

interface Props {
  rules: any;
  filters: any;
  handleChangeFilter: any;
}

interface State {
  loading: boolean;
  rulesChanged: boolean;
}

const Wrapper = styled.div`
  padding: 1em;
  width: 800px;

  .form-inline {
    display: block !important;
  }
`;

class Filter extends React.Component<Props, State> {
  state: State = { rulesChanged: false, loading: false };
  protected queryBuilder = QueryBuilder; // prevents ts-lint to complain about ununused inport
  private ref: any;

  componentDidMount = (): void => {
    const { filters, rules } = this.props;

    if (!rules) {
      this.ref?.queryBuilder({ filters });
    } else {
      this.ref?.queryBuilder({ filters, rules });
    }

    this.onRulesChanged();
  };

  componentDidUpdate = (nextProps: any): void => {
    if (this.state.rulesChanged) {
      return; // user is editing
    }

    const { filters: nextFilters, rules: nextRules } = nextProps;
    const { filters, rules } = this.props;

    if (
      this.compareKeys(
        filters.map((n: any) => n.id),
        nextFilters.map((n: any) => n.id)
      )
    ) {
      // console.log('Filters changed');
      this.ref.queryBuilder('destroy');

      const changed = this.compareKeys(
        rules?.constructor.name === 'Object' &&
          rules.rules.map((n: any) => n.id),
        nextRules?.constructor.name === 'Object' &&
          nextRules.rules.map((n: any) => n.id)
      );

      if (changed && filters && rules) {
        this.ref.queryBuilder({ filters, rules });
        this.onRulesChanged();

        return;
      }

      this.ref.queryBuilder({ filters: nextFilters });
      this.onRulesChanged();
      this.setState({ rulesChanged: false });
    }
  };

  componentWillUnmount = (): void => {
    this.ref?.queryBuilder('destroy');
  };

  handleSave = (): void => {
    this.setState({ loading: true, rulesChanged: false });
    const rules = this.ref.queryBuilder('getRules');
    const { handleChangeFilter } = this.props;
    handleChangeFilter(rules);
    this.setState({ loading: false });
  };

  render = (): JSX.Element => {
    return (
      <Wrapper>
        <h4>Filters</h4>
        <p>
          Add filter variables on the Variables page in order to filter your
          data
        </p>
        {this.props.filters && this.props.filters.length > 0 && (
          <>
            <div id="query-builder" ref={this.createRef} />
            <div className={'save-filter'}>
              <Button
                variant={'primary'}
                onClick={this.handleSave}
                disabled={!this.state.rulesChanged}
              >
                {this.state.loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </>
        )}
      </Wrapper>
    );
  };

  private createRef = (ref: HTMLDivElement): void => {
    if (!this.ref) {
      this.ref = $(ref) as any;
    }
  };

  private onRulesChanged = (): void => {
    this.ref?.queryBuilder('on', 'rulesChanged', () => {
      this.setState({ rulesChanged: true });
    });
    setTimeout(() => {
      this.setState({ rulesChanged: false });
    }, 100);
  };

  private compareKeys = (keys: string[], nextKeys: string[]): boolean =>
    JSON.stringify(keys) !== JSON.stringify(nextKeys);
}

export default Filter;
