"use client";

import React from "react";
import { Button } from "../ui/button";
import { api } from "#/trpc/react";
import { toast } from "sonner";

type Props = {};

const SendMail = (props: Props) => {
  const { mutateAsync: sendMail } = api.email.send.useMutation();
  return (
    <div className="mx-auto mt-14 w-full p-4">
      <Button
        onClick={async () => {
          toast("Sending...");
          try {
            const res = await sendMail();
            console.log("RESPOSE", res);
            toast("EMAIL SENT");
          } catch (error) {
            console.error(error);
            toast("Failed to send mail");
          }
        }}
        className="w-full"
      >
        Send test mail
      </Button>
    </div>
  );
};

export default SendMail;
