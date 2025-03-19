import { atom, useAtom } from 'jotai';
import { useState, useEffect } from 'react';

// Атом для списка задач
const todosAtom = atom<ITodo[]>([
  { id: '1', title: 'title-1', description: 'description-1', status: false },
  { id: '2', title: 'title-2', description: 'description-2', status: true },
  { id: '3', title: 'title-3', description: 'description-3', status: false},
  { id: '4', title: 'title-4', description: 'description-4', status: true },
  { id: '5', title: 'title-5', description: 'description-5', status: true },
]);

interface ITodo {
  id: number | string;
  title: string;
  description: string;
  status: boolean;
}

const App = () => {
  const [todos, setTodos] = useAtom(todosAtom); 
  const [open, setOpen] = useState<boolean>(false);
  const [openE, setOpenE] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [nameE, setNameE] = useState<string>('');
  const [descE, setDescE] = useState<string>('');
  const [edit, setEdit] = useState<ITodo | null>(null);

  useEffect(() => {
    if (edit) {
      setNameE(edit.title);
      setDescE(edit.description);
    }
  }, [edit]);

  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), title: name, description: desc, status: false }]);
    setOpen(false);
    setName('');
    setDesc('');
  };

  const editF = (todo: ITodo) => {
    setEdit(todo);
    setOpenE(true);
  };

  const editTodo = () => {
    setTodos(todos.map((todo : ITodo) => (todo.id === edit?.id ? { ...edit, title: nameE, description: descE } : todo)));
    setOpenE(false);
  };

  const deleteTodo = (id: number | string) => {
    setTodos(todos.filter((todo : ITodo) => todo.id !== id));
  };

  const toggleStatus = (id: number | string) => {
    setTodos(todos.map((todo : ITodo) => (todo.id === id ? { ...todo, status: !todo.status } : todo)));
  };

  return (
    <>
      <div className="flex gap-[10px] items-center w-[90%] justify-between py-[20px] m-auto">
        <h1 className="text-[black] font-bold text-[30px]">
          TodoLIST <span className="text-purple-500 font-bold">JOTAI</span>
        </h1>
        <button onClick={() => setOpen(true)} className="border-2 rounded-md px-[10px] py-[7px] cursor-pointer bg-blue-500 text-[#fff] font-bold">
          + Add New
        </button>
      </div>
      <table className="w-[90%] m-auto mt-[50px] text-center">
        <thead>
          <tr className="border-b-2 py-[10px]">
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo : ITodo) => (
            <tr key={todo.id} className="border-b-2 font-bold">
              <td className="py-[10px]">{todo.title}</td>
              <td className="py-[10px]">{todo.description}</td>
              <td className="py-[10px] w-[200px]">
                <p className={todo.status ? 'text-[#fff] bg-[green] rounded-md px-[10px] py-[5px]' : 'text-[#fff] bg-[red] rounded-md px-[10px] py-[5px]'}>
                  {todo.status ? 'Active' : 'Inactive'}
                </p>
              </td>
              <td className="py-[10px] w-[300px]">
                <div className="flex gap-[10px] items-center px-[50px]">
                  <button onClick={() => deleteTodo(todo.id)} className="border-2 text-[#fff] bg-[red] px-[10px] py-[5px] rounded-md">
                    Delete
                  </button>
                  <button onClick={() => editF(todo)} className="border-2 text-[#fff] bg-blue-700 px-[10px] py-[5px] rounded-md">
                    Edit
                  </button>
                  <input type="checkbox" onChange={() => toggleStatus(todo.id)} checked={todo.status} className="w-[25px] h-[25px]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {open && <Modal setOpen={setOpen} name={name} setName={setName} desc={desc} setDesc={setDesc} save={addTodo} />}
      {openE && <Modal setOpen={setOpenE} name={nameE} setName={setNameE} desc={descE} setDesc={setDescE} save={editTodo} />}
    </>
  );
};

interface ModalProps {
  setOpen: (value: boolean) => void;
  name: string;
  setName: (value: string) => void;
  desc: string;
  setDesc: (value: string) => void;
  save: () => void;
}

const Modal: React.FC<ModalProps> = ({ setOpen, name, setName, desc, setDesc, save }) => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="fixed w-[500px] bg-white rounded-2xl border h-[300px] shadow-2xs">
      <div className="flex flex-col w-[90%] py-[50px] gap-[30px] m-auto">
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Title..." className="w-full px-[10px] py-[10px] rounded-sm border-2" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder="Description..." className="w-full px-[10px] py-[10px] rounded-sm border-2" />
        <div className="flex gap-[10px] items-center">
          <button onClick={save} className="border-2 text-[#fff] py-[5px] rounded-md px-[10px] bg-blue-500">
            Save
          </button>
          <button onClick={() => setOpen(false)} className="cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default App;
