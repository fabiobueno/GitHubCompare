import React from 'react';
import PropTypes from 'prop-types';

import { Container, Repository, CloseButton } from './styles';

const CompareList = ({ repositories, handleRemove, handleUpdate }) => (
  <Container>
    {repositories.map(repository => (
      <Repository key={repository.id}>
        <CloseButton>
          <i className="fa fa-refresh" onClick={() => handleUpdate(repository.id)} />
          <i className="fa fa-times-circle" onClick={() => handleRemove(repository.id)} />
        </CloseButton>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>
        <ul>
          <li>
            {repository.stargazers_count} <small>stars</small>
          </li>
          <li>
            {repository.forks_count} <small>forks</small>
          </li>
          <li>
            {repository.open_issues_count} <small>issues</small>
          </li>
          <li>
            {repository.lastCommit} <small>last commit</small>
          </li>
        </ul>
      </Repository>
    ))}
  </Container>
);

CompareList.propTypes = {
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      stargazers_count: PropTypes.number,
      forks_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      pushed_at: PropTypes.string,
    }),
  ).isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

export default CompareList;
