# using resolved_model gpt-4o-2024-08-06# created from response, to create create_db_models.sqlite, with test data
#    that is used to create project
# should run without error in manager 
#    if not, check for decimal, indent, or import issues

import decimal
import logging
import sqlalchemy
from sqlalchemy.sql import func 
from logic_bank.logic_bank import Rule
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Date, DateTime, Numeric, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship
from datetime import date   
from datetime import datetime

logging.getLogger('sqlalchemy.engine.Engine').disabled = True  # remove for additional logging

Base = declarative_base()  # from system/genai/create_db_models_inserts/create_db_models_prefix.py


class Customer(Base):
    """description: Stores customer information including credit limits and balance."""
    __tablename__ = 'customer'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    balance = Column(Integer, default=0)
    credit_limit = Column(Integer)


class Order(Base):
    """description: Contains order details and references the customer."""
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customer.id'))
    amount_total = Column(Integer, default=0)
    date_shipped = Column(Date)
    notes = Column(String)

    # ForeignKey Constraint
    customer = relationship("Customer", back_populates="orders")


class Item(Base):
    """description: Items included in orders, with amounts calculated from quantity and unit price."""
    __tablename__ = 'item'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('order.id'))
    product_id = Column(Integer, ForeignKey('product.id'))
    quantity = Column(Integer)
    unit_price = Column(Integer)
    amount = Column(Integer, default=0)

    # ForeignKey Constraint
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="items")


class Product(Base):
    """description: List of products available for sale, with pricing details."""
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    unit_price = Column(Integer)

    # Back reference
    items = relationship("Item", back_populates="product")


# ALS/GenAI: Create an SQLite database
engine = create_engine('sqlite:///system/genai/temp/create_db_models.sqlite')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# ALS/GenAI: Prepare for sample data

# Test data for Customer
customer1 = Customer(id=1, name='John Doe', balance=100, credit_limit=500)
customer2 = Customer(id=2, name='Jane Smith', balance=200, credit_limit=600)
customer3 = Customer(id=3, name='Alice Johnson', balance=150, credit_limit=550)
customer4 = Customer(id=4, name='Bob Brown', balance=50, credit_limit=300)

# Test data for Product
product1 = Product(id=1, name='Product A', unit_price=50)
product2 = Product(id=2, name='Product B', unit_price=75)
product3 = Product(id=3, name='Product C', unit_price=100)
product4 = Product(id=4, name='Product D', unit_price=150)

# Test data for Order
order1 = Order(id=1, customer_id=1, amount_total=100, date_shipped=date(2023, 7, 24), notes='First order')
order2 = Order(id=2, customer_id=2, amount_total=150, date_shipped=date(2023, 8, 15), notes='Second order')
order3 = Order(id=3, customer_id=3, amount_total=225, date_shipped=None, notes='Third order pending')
order4 = Order(id=4, customer_id=4, amount_total=50, date_shipped=date(2023, 9, 5), notes='Fourth order')

# Test data for Item
item1 = Item(id=1, order_id=1, product_id=1, quantity=2, unit_price=50, amount=100)
item2 = Item(id=2, order_id=2, product_id=2, quantity=2, unit_price=75, amount=150)
item3 = Item(id=3, order_id=3, product_id=3, quantity=3, unit_price=100, amount=300)
item4 = Item(id=4, order_id=4, product_id=4, quantity=1, unit_price=150, amount=150)



session.add_all([customer1, customer2, customer3, customer4, product1, product2, product3, product4, order1, order2, order3, order4, item1, item2, item3, item4])
session.commit()
