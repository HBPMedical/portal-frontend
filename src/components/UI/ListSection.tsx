import * as React from 'react';

interface Props {
  title: string;
  list?: string[];
}

const ListSection = ({ ...props }: Props): JSX.Element => {
  const { title, list } = props;

  return (
    <section>
      {title && list && (
        <>
          <h4>{title}</h4>
          {list.map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </>
      )}
    </section>
  );
};

export default ListSection;
