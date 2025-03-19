import React, { createContext, ReactNode } from "react";
import { useContext } from "react";

// Define the Post interface
interface Post {
  title: string;
  description: string;
  name: string;
}

// Define the context with proper type
const Context = createContext<Post | undefined>(undefined);

const usePosts = (): Post => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("usePosts must be used within a CompoundComponents");
  }
  return context;
};

// Define props interface for the main component
interface CompoundComponentsProps {
  children: ReactNode;
  post: Post;
}

const CompoundComponents = ({ children, post }: CompoundComponentsProps) => {
  return <Context.Provider value={post}>{children}</Context.Provider>;
};

CompoundComponents.Title = function Title() {
  const post = usePosts();
  return <h1>{post.title}</h1>;
};

CompoundComponents.Description = function Description() {
  const post = usePosts();
  return <p>{post.description}</p>;
};

CompoundComponents.Author = function Author() {
  const post = usePosts();
  return <p>{post.name}</p>;
};

export default CompoundComponents;
