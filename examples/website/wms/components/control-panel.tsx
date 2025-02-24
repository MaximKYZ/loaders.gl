import styled from 'styled-components';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from '@monaco-editor/react';
import {INITIAL_CATEGORY_NAME, INITIAL_EXAMPLE_NAME} from '../examples';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 12px 24px;
  margin: 20px;
  font-size: 13px;
  line-height: 2;
  outline: none;
  z-index: 100;

  h2 {
    margin: 0 0 0.5rem 0;
  }

  .loading-indicator {
    margin: 0;
    text-align: center;
    transition: opacity 300ms ease-out;
  }

  .monaco-editor {
    height: calc(100vh - 200px) !important;
    width: 500px !important;
  }
`;

const DropDown = styled.select`
  margin: 0.5rem 0;
  font-size: 16px;
`;

const propTypes = {
  examples: PropTypes.object,
  selectedCategory: PropTypes.string,
  selectedExample: PropTypes.string,
  onExampleChange: PropTypes.func
};

const defaultProps = {
  examples: {},
  droppedFile: null,
  selectedCategory: null,
  selectedExample: null,
  onChange: () => {}
};

export default class ControlPanel extends PureComponent {
  constructor(props) {
    super(props);
    this._autoSelected = false;
  }

  componentDidMount() {
    const {examples = {}, onExampleChange} = this.props;

    let selectedCategory = this.props.selectedCategory;
    let selectedExample = this.props.selectedExample;

    if ((!selectedCategory || !selectedExample) && !this._autoSelected) {
      selectedCategory = INITIAL_CATEGORY_NAME;
      selectedExample = examples[selectedCategory][INITIAL_EXAMPLE_NAME];
      this._autoSelected = true;
    }

    if (selectedCategory && selectedExample) {
      const example = examples[selectedCategory][selectedExample];
      onExampleChange({selectedCategory, selectedExample, example});
    }
  }

  _renderDropDown() {
    const {examples = {}, selectedCategory, selectedExample, onExampleChange} = this.props;

    if (!selectedCategory || !selectedExample) {
      return false;
    }

    const selectedValue = `${selectedCategory}.${selectedExample}`;

    return (
      <DropDown
        value={selectedValue}
        onChange={(evt) => {
          const loaderExample = evt.target.value;
          const value = loaderExample.split('.');
          const loaderName = value[0];
          const exampleName = value[1];
          const example = examples[loaderName][exampleName];
          onExampleChange({selectedCategory: loaderName, selectedExample: exampleName, example});
        }}
      >
        {Object.keys(examples).map((loaderName, loaderIndex) => {
          const loaderExamples = examples[loaderName];
          return (
            <optgroup key={loaderIndex} label={loaderName}>
              {Object.keys(loaderExamples).map((exampleName, exampleIndex) => {
                const value = `${loaderName}.${exampleName}`;
                return (
                  <option key={exampleIndex} value={value}>
                    {`${exampleName} (${loaderName})`}
                  </option>
                );
              })}
            </optgroup>
          );
        })}
      </DropDown>
    );
  }

  render() {
    return (
      <Container>
        {this._renderDropDown()}
        {this.props.children}
        <pre className="loading-indicator" style={{opacity: this.props.loading ? 1 : 0}}>
          loading image...
        </pre>
        <h2>WMS Server Capabilities</h2>
        <MonacoEditor
          language="json"
          options={{readOnly: true}}
          theme="vs-dark"
          value={this.props.metadata}
        />
      </Container>
    );
  }
}

ControlPanel.propTypes = propTypes;
ControlPanel.defaultProps = defaultProps;
