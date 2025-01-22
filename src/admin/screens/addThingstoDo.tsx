
import AddThingsToDoForm from '../components/addthingstodoform';

// Définir le type des props
interface AddThingsToDoFormProps {
    index: number | null;
  }

const AddTingstoDo:React.FC<AddThingsToDoFormProps>  = ({index})=>{
    return (<AddThingsToDoForm index={index}/>);
}

export default AddTingstoDo;
