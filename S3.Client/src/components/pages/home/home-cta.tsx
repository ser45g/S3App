import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";

const HomeCta = () => {
  return (
    <section className="container mx-auto px-4 pb-24">
      <Card className="dark:bg-violet-400">
        <CardContent className="flex flex-col items-center justify-between gap-6 p-10 md:flex-row md:p-14">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to upload your first file?
            </h2>
            <p className="mt-2 text-shadow-foreground">
              Join thousands of users who trust FileFlow every day.
            </p>
          </div>
          <Button className="p-4" variant="secondary">
            <Link to="/signup" className="flex flex-row gap-2 items-center">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default HomeCta;
