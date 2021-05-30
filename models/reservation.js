/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }


  async save(){
    let statement = ''; 
    let args = [this.customerId, this.numGuests, this.startAt, this.notes];
    if(this.id === undefined){
      statement =  `INSERT INTO reservations(customer_id, num_guests, start_at, notes)
                    VALUES($1, $2, $3, $4);`
    }
    else{
      statement = `UPDATE reservations
                   SET customer_id=$1, num_guests=$2, 
                    start_at=$3, notes='$4'
                   WHERE id=$5`;
      args.push(this.id); 
    }
    
    const resp = await db.query(statement, args); 

    
    
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }
}


module.exports = Reservation;
