import { json } from "react-router-dom";
import "./FormErrors.css";
import FormErrorItem from "./FormErrorItem";

export default function FormErrors(props) {
  let el_errors = null;

  if (props.errors.length > 0) {
    el_errors = (
      <div className="errors">
        {props.errors.map((err_code) => {
            return <FormErrorItem key={err_code} err_code={err_code} />;
        })}
      </div>
    );
  }

  return <div className="errorsWrap">{el_errors}</div>;
}
