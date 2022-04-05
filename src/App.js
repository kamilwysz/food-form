import { useState, useEffect, React } from 'react';
import './App.css';

function App() {
  const initialValues = { name: "", preparation_time: "00:00:00", type: "", no_of_slices: "", diameter: 32, spiciness_scale:"", slices_of_bread: "" };
  const [foodArray, setFoodArray] = useState([])
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState(initialValues);
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

const setParameters = e =>{
  let dish = {name:formValues.name, preparation_time:formValues.preparation_time, type:formValues.type}
  if (formValues.type==="pizza") Object.assign(dish, {no_of_slices:Number(formValues.no_of_slices), diameter:Number(formValues.diameter)})
  else if(formValues.type==="soup") Object.assign(dish, {spiciness_scale:Number(formValues.spiciness_scale)})
  else if(formValues.type==="sandwich") Object.assign(dish, {slices_of_bread:Number(formValues.slices_of_bread)})
  return dish
}

const handleSubmitForm = e =>{
  e.preventDefault()
  setFormErrors(validate(formValues));
  setFormIsSubmitted(true)
  }
  const submitForm = e =>{
  let dish = setParameters()
  fetch('https://frosty-wood-6558.getsandbox.com:443/dishes',{
    headers:{'Content-Type':'application/json'},
    method: 'POST',
    body: JSON.stringify(dish)
  })
  .then(res => res.json())
  .then(res=>setFoodArray(oldArray => [...oldArray, res]))
  .then(setFormValues(initialValues))
  .then(setTimeout((e) => {
    setFormIsSubmitted(false)
  }, 5000))
  }

useEffect(()=>{
  if (Object.keys(formErrors).length===0 && formIsSubmitted){
    submitForm()
  }
},[formErrors])

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Enter dish name!";
  }
  if (values.preparation_time=="00:00:00") {
    errors.preparation_time = "Enter time to prepare food!";
  }
  if (!values.type) {
    errors.type = "Choose type of food";
  }
  if (!values.no_of_slices && values.type==="pizza") {
    errors.no_of_slices = "Choose number of pizza slices";
  }
  if ((!values.spiciness_scale || values.spiciness_scale > 10) && values.type==="soup") {
    errors.spiciness_scale = "Choose spiciness scale from 1-10";
  }
  if (!values.slices_of_bread && values.type==="sandwich") {
    errors.slices_of_bread = "Choose number of bread slices";
  }
  return errors;
};

  return (
    <form className="App" onSubmit={handleSubmitForm}>
      <h2>Add new dish</h2>
      <p className='form-instruction'>Fill the form and click "Register" to add new dish</p>
      <label>
        Dish name:<br/>
        <input id="dish-name" type="text" value={formValues.name} name="name" onChange={handleChange}/>
        {formErrors.name?<p className='warning'>{formErrors.name}</p>:""}
      </label>
      <label>
        Preparation time:<span className='hint'> (hh:mm:ss)</span><br/>
        <input type="time" step="1" min="00:00:00"  value={formValues.preparation_time} name="preparation_time" onChange={handleChange}></input>
        {formErrors.preparation_time?<p className='warning'>{formErrors.preparation_time}</p>:""}
      </label>
      <label>
        Dish type:<br/>
        <select value={formValues.type} name="type" onChange={handleChange}>
          <option value="" disabled>-Choose-</option>
          <option value="pizza">Pizza</option>
          <option value="soup">Soup</option>
          <option value="sandwich">Sandwich</option>
        </select>
        {formErrors.type?<p className='warning'>{formErrors.type}</p>:""}
      </label>
      {formValues.type==="pizza"? <div>
      <label>
        Number of slices:<br/>
        <input min={1} type="number" value={formValues.no_of_slices} name="no_of_slices" onChange={handleChange}/>
        {formErrors.no_of_slices?<p className='warning'>{formErrors.no_of_slices}</p>:""}
      </label>
      <label>
        Diameter:<span className='hint'> (10-62 cm) </span><br/>
        <input min={10} max={62} defaultValue={32.0} step={0.1} style={{'padding':'0'}} name="diameter" type="range" onChange={handleChange}/>
        <br/>
        <p className="diameter-value">{formValues.diameter} cm</p>
      </label>
      </div> : ""}
      {formValues.type==="soup"? <label>
        Spiciness scale: <span className='hint'> (1-10)</span><br/>
        <input min={1} type="number" value={formValues.spiciness_scale} name="spiciness_scale" onChange={handleChange}/>
        {formErrors.spiciness_scale?<p className='warning'>{formErrors.spiciness_scale}</p>:""}
      </label> : ""}
      {formValues.type==="sandwich"? <label>
        Number of slices of bread:<br/>
        <input min={1} type="number" value={formValues.slices_of_bread}  name="slices_of_bread" onChange={handleChange}/>
        {formErrors.slices_of_bread?<p className='warning'>{formErrors.slices_of_bread}</p>:""}
      </label> : ""}
      <button className='submit-button'>Register</button>
      {(Object.keys(formErrors).length===0 && formIsSubmitted) && <p className='success'>&#10004; Dish succesfully added!</p>}
    </form>
  );
}

export default App;
