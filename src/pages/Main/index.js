import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';

import logo from '../../assets/logo.png';

import { Container, Form } from './styles';

import CompareList from '../../components/CompareList/index';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: '',
    repositories: [],
  };

  componentWillMount() {
    const repository = localStorage.repositories;
    if (typeof repository !== 'undefined') {
      this.setState({
        repositories: JSON.parse(localStorage.repositories),
      });
    }
  }

  handleAddRepository = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);
      repository.lastCommit = moment(repository.pushed_at).fromNow();
      this.setState({
        repositoryInput: '',
        repositories: [...this.state.repositories, repository],
        repositoryError: false,
      });

      localStorage.repositories = JSON.stringify(this.state.repositories);
    } catch (err) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  handlerRemoveRepository = (key) => {
    const { repositories } = this.state;
    const repo = repositories.filter(value => value.id !== key);

    this.setState({
      repositories: repo,
    });

    localStorage.repositories = JSON.stringify(repo);
  }

  handlerUpdateRepository = async (key) => {
    const { repositories } = this.state;
    const repo = repositories.filter(value => value.id === key);

    try {
      const { data: repository } = await api.get(`/repos/${repo[0].full_name}`);
      repository.lastCommit = moment(repository.pushed_at).fromNow();

      const indexOfUpdate = repositories.findIndex(value => value.id === key);

      repositories[indexOfUpdate] = repository;

      this.setState({
        repositories,
      });

      localStorage.repositories = JSON.stringify(this.state.repositories);
    } catch (err) {
      console.log('Error update');
    }
  }

  render() {
    return (
      <Container>
        <img src={logo} alt="GitHub Compare" />

        <Form withError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'Ok'}
          </button>
        </Form>

        <CompareList
          repositories={this.state.repositories}
          handleRemove={this.handlerRemoveRepository}
          handleUpdate={this.handlerUpdateRepository}
        />

      </Container>
    );
  }
}
