/*global CSL: true */

CSL.Node.intext = {
    build: function (state, target) {
        if (this.tokentype === CSL.START) {

            state.build.area = "intext";
            state.build.root = "intext";
            state.build.extension = "";

            var func = function(state, Item) {
                state.tmp.area = "intext";
                state.tmp.root = "intext";
                state.tmp.extension = "";
            }
            this.execs.push(func);
        }
        if (this.tokentype === CSL.END) {

            // Open an extra key at first position for use in
            // grouped sorts.
            // print("in cs:intext END");
            state.opt.grouped_sort = state.opt.xclass === "in-text" 
                && (state.citation.opt.collapse 
                    && state.citation.opt.collapse.length)
                || (state.citation.opt.cite_group_delimiter
                    && state.citation.opt.cite_group_delimiter.length)
                && state.opt.update_mode !== CSL.POSITION
                && state.opt.update_mode !== CSL.NUMERIC;
            
            if (state.opt.grouped_sort 
                && state.citation_sort.opt.sort_directions.length) {
                
                state.intext_sort.opt.sort_directions = state.citation_sort.opt.sort_directions;
            }
            state.intext.srt = state.citation.srt;
        }
        target.push(this);
    }
};

