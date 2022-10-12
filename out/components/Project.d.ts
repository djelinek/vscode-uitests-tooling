/**
 * Project class represents VS code workspace.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare class Project {
    private _path;
    private _isOpen;
    /**
     * Create new object with path. The object does not create project in file system.
     * @param _path of project
     */
    constructor(_path: string);
    get path(): string;
    get exists(): boolean;
    get isOpen(): boolean;
    /**
     * Creates new project in filesystem.
     */
    create(): void;
    /**
     * Create new project from project template.
     * @param path path of existing project
     */
    createFrom(path: string): void;
    /**
     * Opens project in VS code.
     */
    open(): Promise<void>;
    /**
     * Closes project in VS code.
     */
    close(): Promise<void>;
    /**
     * Deletes project in VS code.
     */
    delete(): Promise<void>;
}
export { Project };
