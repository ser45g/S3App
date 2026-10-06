import React from "react";

const steps = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up in seconds — no credit card required.",
  },
  {
    step: "02",
    title: "Upload your files",
    description: "Drag files into the browser or use our API.",
  },
  {
    step: "03",
    title: "Share or download",
    description: "Get a link, or download from any device, anywhere.",
  },
];

const HomeSteps = () => {
  return (
    <section id="how" className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get started in 3 simple steps
        </h2>
        <p className="mt-4 text-muted-foreground">
          No setup, no configuration. Just sign up and go.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map(({ step, title, description }) => (
          <div key={step} className="relative">
            <div className="text-5xl font-bold text-primary/20">{step}</div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeSteps;
