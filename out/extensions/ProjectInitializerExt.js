"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInitializerExt = void 0;
/**
 * Contains all specific methods, constants, etc. for extension - Project Initializer
 * @author odockal
 */
var ProjectInitializerExt;
(function (ProjectInitializerExt) {
    ProjectInitializerExt.PROJECT_INITIALIZER_NAME = 'Project Initializer by Red Hat';
    class PaletteOptionsGeneral {
    }
    PaletteOptionsGeneral.camel = "a Camel/Fuse";
    PaletteOptionsGeneral.go = "a Go";
    PaletteOptionsGeneral.vertx = "an Eclipse Vert.x";
    PaletteOptionsGeneral.thorntail = "a Thorntail";
    PaletteOptionsGeneral.spring = "a Spring Boot";
    PaletteOptionsGeneral.nodejs = "a NodeJS";
    ProjectInitializerExt.PaletteOptionsGeneral = PaletteOptionsGeneral;
    class PaletteOptionsMission {
    }
    PaletteOptionsMission.x = "";
    ProjectInitializerExt.PaletteOptionsMission = PaletteOptionsMission;
})(ProjectInitializerExt || (ProjectInitializerExt = {}));
exports.ProjectInitializerExt = ProjectInitializerExt;
//# sourceMappingURL=ProjectInitializerExt.js.map