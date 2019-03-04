import React from 'react';

export default function Rating(props) {

  let percentage = 100 * (props.value / 5.0);

  return (
    <div className="Rating">
      <div className="empty-stars" />
      <div className="full-stars" style={{ width: `${percentage}%` }} />
    </div>
  );
}