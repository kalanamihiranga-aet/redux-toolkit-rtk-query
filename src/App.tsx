import React, { FC, useState } from "react";
import { RepositoryStatus, RepositoryObjectDetail, fetchRepositories } from "./features/repositories/repositorySlice";
import { useAppDispatch, useAppSelector } from "./hook";

const App: FC = () => {
  const [term, setTerm] = useState("");
  const dispatch = useAppDispatch();
  const repositories = useAppSelector((state) => state.repositories.repositories);
  const error = useAppSelector((state) => state.repositories.error);
  const status = useAppSelector((state) => state.repositories.status);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(fetchRepositories(term));
  }

  return (
    <>
      <div>
        <h1>React redux toolkit rtk query</h1>
        <form onSubmit={onSubmitForm}>
          <input value={term} onChange={e => setTerm(e.target.value)} />
          <button>Search</button>
        </form>
        {status === RepositoryStatus.PENDING && <h2>...Loading</h2>}
        {status === RepositoryStatus.ERROR && <h2>{error}</h2>}
        {status === RepositoryStatus.SUCCESS && repositories.map((repository: RepositoryObjectDetail, key: number) =>
          <div key={key}>{repository.package.name}</div>)}
      </div>
    </>
  );
}

export default App;