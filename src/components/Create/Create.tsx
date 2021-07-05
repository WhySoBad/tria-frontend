import { Button } from "@material-ui/core";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import style from "../../styles/modules/Create.module.scss";
import Input from "../Input/Input";

interface CreateProps {}

const Create: React.FC<CreateProps> = (): JSX.Element => {
  return (
    <main className={style["container"]}>
      <section className={style["title-container"]}>
        <h3 className={style["title"]} children={"Create Group"} />
      </section>
      <section className={style["content-container"]}>
        <Form />
      </section>
    </main>
  );
};

interface FormProps {}

type Inputs = { name: string; tag: string; type: string; description: string; members: string };

const Form: React.FC<FormProps> = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder={"Name"} {...register("name")} />
      <Input placeholder={"Tag"} {...register("tag")} />
      <Input placeholder={"Description"} {...register("description")} />
      <Input placeholder={"Type"} {...register("type")} />
      <Input placeholder={"Members"} {...register("members")} />
      <Button type={"submit"}>submit</Button>
    </form>
  );
};

export default Create;
