// class PromiseQueue {
//     queue = this.newQueue()

//     newQueue(){
//         return Promise.resolve('___')
//     }
//     then(callback) { callback(this.queue) }
//     // chain(callback) {
//     //     return this.queue = this.queue
//     //         .then((x)=>{console.log('queue x', x?.length);return x;})
//     //         .then(callback)
//     // }
//     f1(){
//         this.add(async (x)=>{
//             return x+'1';
//         })
//         return this
//     }

//     f2(){
//         this.add(async (x)=>{
//             return x+'a';
//         })
//         return this
//     }

//     async add(operation) {
//       return this.queue = this.queue
//         .then(operation)
//         .finally(()=>{
//             this.queue = this.newQueue()
//         })
//     }
//   }


    //   it('instantiates empty database', async () => {
    //     let pq = new PromiseQueue()
    //     let out1 = await pq.f1().f1().f2()//.data()
    //     console.log(out1)
    //     let out2 = await pq.f2().f2()//.data()
    //     console.log(out2)
    // });