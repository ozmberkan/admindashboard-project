import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  slug: string[];
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const queryClient = useQueryClient();

  const initialFormData = props.columns.reduce(
    (acc, column) => {
      if (column.field !== "id" && column.field !== "img") {
        acc[column.field] = "";
      }
      return acc;
    },
    { createdAt: "" } as Record<string, any>
  );

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`http://localhost:5174/api/${props.slug}s`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: 111,
          img: "",
          verified: true,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`all${props.slug}s`]);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
    props.setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span onClick={() => props.setOpen(false)} className="close">
          X
        </span>
        <h1>Add new {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                <input
                  type={column.type || "text"}
                  name={column.field}
                  placeholder={column.field}
                  value={formData[column.field] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
