import { Author } from "../../author/model/author";
import { Category } from "../../category/model/category";

export class Game {
    id: number;
    title: string;
    age: number;
    category: Category;
    author: Author;
}
