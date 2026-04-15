import { Pageable } from "../../core/model/page/Pageable";
import { Author } from "./author"; // Por algun motivo si pongo la A mayuscula no lo pilla

export class AuthorPage {
    content: Author[];
    pageable: Pageable;
    totalElements: number;
}