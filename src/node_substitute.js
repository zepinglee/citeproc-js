/*global CSL: true */

CSL.Node.substitute = {
    build: function (state, target) {
        var func;
        if (this.tokentype === CSL.START) {
            // set conditional
            func = function (state) {
                state.tmp.can_block_substitute = true;
                if (state.tmp.value.length && !state.tmp.common_term_match_fail) {
                    state.tmp.can_substitute.replace(false, CSL.LITERAL);
                }
                state.tmp.common_term_match_fail = false;
            };
            this.execs.push(func);
        }
        target.push(this);
    }
};


