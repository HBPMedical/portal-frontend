import * as React from 'react';

interface Props {
  title: string;
  list?: string[];
}

class ListSection extends React.Component<Props> {
  render(): JSX.Element {
    const { title, list } = this.props;

    return (
      <>
        {title && list && (
          <>
            <h4>{title}</h4>
            {list.map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </>
        )}
      </>
    );
  }
}

export default ListSection;
